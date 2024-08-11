import tkinter as tk
from tkinter import messagebox, Toplevel, Label, Button, Scrollbar, Canvas, Frame
from PIL import Image, ImageTk
import threading
import socketio
from plyer import notification as plyer_notification
import os

# Socket.IO client
sio = socketio.Client()

# List to store notifications
notifications = []

def connect_to_server(project_id):
    if sio.connected:
        sio.disconnect()
    
    @sio.event
    def connect():
        print("Connected to server")
        update_status("Connected", "green")
        sio.emit('register', {'projectId': project_id})

    @sio.event
    def disconnect():
        print("Disconnected from server")
        update_status("Disconnected", "red")

    @sio.on('notification')
    def on_notification(data):
        title = data.get('title', 'Notification')[:256]  # Truncate title
        msg = data.get('message', '')[:256]  # Truncate message
        notifications.append({'title': title, 'message': msg})
        plyer_notification.notify(
            app_icon="icon.ico",
            title=title,
            message=msg,
            app_name='Desktop Notifier',
            timeout=10
        )
        update_notification_list()

    update_status("Connecting...", "orange")
    sio.connect('https://desktop-notifier.onrender.com', transports=['websocket'])

def start_notifier():
    project_id = entry_project_id.get()
    if project_id:
        threading.Thread(target=connect_to_server, args=(project_id,)).start()
        entry_project_id.config(state=tk.DISABLED)
    else:
        messagebox.showerror("Error", "Please enter a Project ID")

def stop_notifier():
    if sio.connected:
        sio.disconnect()
        entry_project_id.config(state=tk.NORMAL)
        update_status("Disconnected", "red")

def show_notification(notification):
    custom_messagebox(notification['title'], notification['message'])

def custom_messagebox(title, message):
    dialog = Toplevel(root)
    dialog.title(title)

    # Set the icon for the dialog
    icon_path = "icon.ico"
    if os.path.exists(icon_path):
        try:
            icon_image = Image.open(icon_path)
            dialog.iconphoto(True, ImageTk.PhotoImage(icon_image))
        except Exception as e:
            print(f"Error setting icon: {e}")

    # Create a frame for the content
    content_frame = Frame(dialog)
    content_frame.pack(padx=20, pady=20, fill='both', expand=True)

    # Add message label
    msg_label = Label(content_frame, text=message, wraplength=480, justify='left')
    msg_label.pack(pady=10, fill='both', expand=True)

    # Create a frame for the button
    button_frame = Frame(dialog)
    button_frame.pack(pady=10)

    # Add OK button
    ok_button = Button(button_frame, text="OK", command=dialog.destroy)
    ok_button.pack()

    # Ensure the dialog size fits the content
    dialog.update_idletasks()
    dialog.minsize(dialog.winfo_width(), dialog.winfo_height())

    dialog.transient(root)
    dialog.grab_set()
    root.wait_window(dialog)

def delete_notification(index):
    del notifications[index]
    update_notification_list()

def update_notification_list():
    for widget in canvas_frame.winfo_children():
        widget.destroy()

    for index, notification in enumerate(notifications):
        frame = tk.Frame(canvas_frame, bg='lightgrey')
        frame.grid(row=index, column=0, padx=5, pady=5, sticky='ew')

        title_label = tk.Label(frame, text=notification['title'], anchor='w', bg='lightgrey', padx=5, wraplength=150)
        title_label.grid(row=0, column=0, sticky='ew')

        message_label = tk.Label(frame, text=notification['message'], anchor='w', bg='lightgrey', padx=5, wraplength=350)
        message_label.grid(row=0, column=1, sticky='ew')

        button_frame = tk.Frame(frame, bg='lightgrey')
        button_frame.grid(row=0, column=2, padx=5, sticky='e')

        show_button = tk.Button(button_frame, text="Show", command=lambda n=notification: show_notification(n))
        show_button.pack(side=tk.LEFT)

        delete_button = tk.Button(button_frame, text="Delete", command=lambda i=index: delete_notification(i))
        delete_button.pack(side=tk.LEFT)

    # Update the canvas scroll region
    canvas_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))

def update_status(status, color):
    status_label.config(text=f"Status: {status}", fg=color)

# Create the GUI
root = tk.Tk()
root.title("Desktop Notifier")
root.geometry("600x400")
root.resizable(False, False)  # Disable resizing

# Check if the icon file exists and set it if it does
icon_path = "icon.ico"
if os.path.exists(icon_path):
    root.iconbitmap(icon_path)

# Configure grid weights
root.grid_rowconfigure(0, weight=0)
root.grid_rowconfigure(1, weight=0)
root.grid_rowconfigure(2, weight=0)
root.grid_rowconfigure(3, weight=1)  # Allows notification_frame to expand
root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)
root.grid_columnconfigure(2, weight=0)
root.grid_columnconfigure(3, weight=0)

# Main content frame
frame = tk.Frame(root)
frame.grid(row=0, column=0, padx=20, pady=20, columnspan=4, sticky='ew')

tk.Label(frame, text="Enter Project ID:").pack(pady=10, anchor='w')
entry_project_id = tk.Entry(frame)
entry_project_id.pack(pady=5, fill='x')

# Center buttons using a separate frame
button_frame = tk.Frame(frame)
button_frame.pack(pady=10, anchor='center')

tk.Button(button_frame, text="Start Notifier", command=start_notifier).pack(side=tk.LEFT, padx=5)
tk.Button(button_frame, text="Stop Notifier", command=stop_notifier).pack(side=tk.LEFT, padx=5)

status_label = tk.Label(root, text="Status: Not connected", fg="red")
status_label.grid(row=1, column=0, columnspan=4, pady=10, sticky='ew')

# Create a canvas for notifications with a scrollbar
canvas = Canvas(root)
scrollbar = Scrollbar(root, orient="vertical", command=canvas.yview)
canvas.configure(yscrollcommand=scrollbar.set)

# Create a frame inside the canvas
canvas_frame = Frame(canvas)
canvas.create_window((0, 0), window=canvas_frame, anchor="nw")

# Grid layout for canvas and scrollbar
canvas.grid(row=3, column=0, columnspan=3, sticky='nsew')
scrollbar.grid(row=3, column=3, sticky='ns')

# Update the canvas scroll region
canvas_frame.update_idletasks()
canvas.config(scrollregion=canvas.bbox("all"))

root.mainloop()
