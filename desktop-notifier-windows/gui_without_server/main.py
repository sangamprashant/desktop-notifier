import tkinter as tk
from tkinter import Label, Entry, Button, Frame, messagebox
from PIL import Image, ImageTk
from plyer import notification as plyer_notification
import threading
import time

def send_notification(title, message, delay):
    try:
        time.sleep(delay)
        plyer_notification.notify(
            title=title,
            message=message,
            app_name='Notifier App',
            app_icon="icon.ico",
            timeout=10
        )
        update_status("Notification sent!", "green")
    except Exception as e:
        update_status(f"Error: {str(e)}", "red")

def start_notification():
    title = entry_title.get().strip()
    message = entry_message.get().strip()
    delay = entry_delay.get().strip()

    if not title or not message:
        update_status("Title and message are required.", "red")
        return

    if not delay.isdigit() or int(delay) < 0:
        update_status("Delay must be a non-negative number.", "red")
        return

    update_status("Sending...", "orange")
    threading.Thread(target=send_notification, args=(title, message, int(delay))).start()

    # Clear fields after sending
    entry_title.delete(0, tk.END)
    entry_message.delete(0, tk.END)
    entry_delay.delete(0, tk.END)

def update_status(message, color):
    status_label.config(text=message, fg=color)
    root.after(5000, lambda: status_label.config(text=""))  # Clear status message after 5 seconds

# GUI Setup
root = tk.Tk()
root.title("Notifier App")
root.geometry("500x350")
root.resizable(False, False)
root.configure(bg="#f0f0f0")

# Set icon if available
icon_path = "icon.ico"
if icon_path:
    root.iconbitmap(icon_path)

# Main Frame
main_frame = Frame(root,  bd=2, relief=tk.GROOVE)
main_frame.pack(pady=20, padx=20, fill="both", expand=True)

# Title input
Label(main_frame, text="Title:",  font=("Arial", 12)).pack(pady=5, anchor="w")
entry_title = Entry(main_frame, font=("Arial", 12))
entry_title.pack(pady=5, fill="x")

# Message input
Label(main_frame, text="Message:",  font=("Arial", 12)).pack(pady=5, anchor="w")
entry_message = Entry(main_frame, font=("Arial", 12))
entry_message.pack(pady=5, fill="x")

# Delay input
Label(main_frame, text="Delay (seconds):", font=("Arial", 12)).pack(pady=5, anchor="w")
entry_delay = Entry(main_frame, font=("Arial", 12))
entry_delay.pack(pady=5, fill="x")

# Notify button
Button(main_frame, text="Send Notification", command=start_notification, bg="#007bff", fg="white", font=("Arial", 12), bd=0).pack(pady=20)

# Status label
status_label = Label(root, text="", bg="#f0f0f0", font=("Arial", 10))
status_label.pack(pady=5)

root.mainloop()
