# Voccci API

A RESTful API service that extracts vocabulary word pairs (German-Italian) from images using OpenAI's vision capabilities.

## Description

This project provides an API for extracting and managing vocabulary word pairs from images. It uses OpenAI's vision capabilities for image processing and stores the data in a PostgreSQL database.

## Features

- Image Processing: Extract vocabulary pairs from uploaded images
- Authentication: Secure endpoints with JWT authentication 
- Database Storage: Persist vocabulary pairs using PostgreSQL with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository
2. Run the `npm install` command to install dependencies
3. Set up your environment variables (see below)

## Getting Started

To start the application:

1. First run the prisma migrate command to set up your database
2. Start the development server using `npm run dev`
3. The API will be available at `localhost:5000`

## Environment Setup

Create a `.env` file in the root directory with the following variables: 
