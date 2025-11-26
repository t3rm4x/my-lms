# LearnHub: Serverless Learning Management System (LMS)
This project is a scalable, cloud-native Learning Management System designed to handle student/instructor registration, course delivery, and material access. It leverages a Serverless Architecture on AWS to ensure high availability and low operational costs.

# 🏗️ Architecture
The application follows a decoupled serverless pattern:

1.	Frontend: Hosted statically on S3 (Private) and served via CloudFront (CDN) for low latency and SSL termination.

2.	DNS/Routing: Managed by Route53.

3.	Backend: API Gateway acts as the entry point, routing requests to AWS Lambda functions.

4.	Database: DynamoDB stores user data, course metadata, and progress logs.

5.	Storage: A separate public S3 bucket holds course materials (PDFs, Videos).

6.	Auth & Notifications: AWS SES handles MFA codes and transactional emails.

7.	IAM strictly manages service-to-service permissions.
________________________________________

# 🛠️ Tech Stack:
Frontend  
•	Framework: React.js  
•	Build Tool: Vite  
•	Styling: Tailwind  

Backend (AWS Serverless)  
•	Compute: AWS Lambda (Node.js)  
•	API Management: Amazon API Gateway (RESTful)  
•	Database: Amazon DynamoDB (NoSQL)  
•	Object Storage: Amazon S3  
•	Security: AWS IAM & Route53  
•	Communication: Amazon SES (Simple Email Service)  
________________________________________

# 📂 Project Structure
Check the GitHub repo for the project structure.   
Access it here : https://github.com/t3rm4x/my-lms  
________________________________________

# 🚀 Getting Started

Prerequisites  
•	Node.js (v18.x or later)  
•	AWS CLI (Configured with aws configure)  
•	Frontend Package Manager, e.g., npm  

# 1. Environment Variables  
Create a .env file in the frontend directory based on the .env.example:  

VITE_API_BASE_URL=https://[api-id].execute-api.[region].amazonaws.com/prod  
VITE_API_REGISTER_URL= https://[api-id].execute-api.[region].amazonaws.com/prod/register  
VITE_API_LOGIN_URL= https://[api-id].execute-api.[region].amazonaws.com/prod/login  
VITE_API_VERIFY_URL= https://[api-id].execute-api.[region].amazonaws.com/prod/verify  
VITE_API_SEND_URL= https://[api-id].execute-api.[region].amazonaws.com/prod/send-verification  
VITE_API_VERIFYCODE_URL= https://[api-id].execute-api.[region].amazonaws.com/prod /verify-code  
VITE_API_KEY=Your-api-key  
VITE_S3_BUCKET_NAME=your-bucket-name  
VITE_S3_REGION=your-region  
VITE_API_S3_PROXY_URL= https://[api-id].execute-api.[region].amazonaws.com/prod/s3/list  
VITE_API_MFA_SEND_URL= https://[api-id].execute-api.[region].amazonaws.com/prod /mfa/send  
VITE_API_MFA_VERIFY_URL= https://[api-id].execute-api.[region].amazonaws.com/prod /mfa/verify  

Backend .env<br>
The backend environment variables need to be configured while setting up the Lambda function.  

# 2. Local Development
Backend:<br>
The backend files would handle the auth stack – register-login-verify and then proceed to route to the dashboard. This is handled by multiple Lambda functions that have specific roles setup through the IAM policies. Once this is done and API endpoints have been configured through AWS API Gateway, you can start sending curl requests to check if the backend is up and running. Make sure to deploy the configured APIs to a stage(prod,dev etc.) in order to test them.<br>
<br>  
Frontend:<br>
Command prompt:<br>
cd frontend<br>
npm install<br>
npm run dev<br>
________________________________________

# ☁️ Deployment Guide
Infrastructure Setup<br>
<br>
•	S3 & CloudFront: The frontend bucket is Private. Access is granted strictly through CloudFront using an Origin Access Identity (OAI) or Origin Access Control (OAC).  

•	DynamoDB: Ensure the table is created properly.  

•	IAM Policies: Ensure Lambda execution roles have Allow permissions for various policies such as AmazonDynamoDBFullAccess, AmazonSESFullAccess etc.  

Deployment locally : npm run dev  
________________________________________

# 📧 Email & MFA (SES)
This system uses AWS SES for authentication challenges. When a user logs in, Lambda generates a code, stores it in DynamoDB (with TTL), and calls SES to email the user.  

•	Production Note: Ensure your domain is verified in SES. If in Sandbox mode, verify all recipient emails.
________________________________________
