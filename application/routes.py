from application import app, mail
from flask import render_template, request, jsonify
import secrets, os
from PIL import Image
from flask_mail import Message

@app.route('/')
def home():  
  return render_template('home.html', title='Home')

@app.route('/resume')
def resume():
  return render_template('resume.html', title='Resume Page')

@app.route('/portfolio')
def portfolio():  
  return render_template('portfolio.html', title='Portfolio Page')

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.form
    fullname = data.get('fullname')
    email = data.get('email')
    message_body = data.get('message')

    msg = Message(subject=f"Message from {fullname}",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=['calebkiptoo9090@gmail.com'],
                  body=f"From: {fullname} <{email}>\n\n{message_body}")

    try:
        mail.send(msg)
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
