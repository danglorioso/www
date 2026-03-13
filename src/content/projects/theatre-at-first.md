---
title: "Theatre@FIRST"
description: "An inventory management system for Theatre@FIRST—a community theatre in Somerville, MA—to track costumes, props, and furniture with photo uploads, location tracking, and condition monitoring. Created on a team of 10 developers."
startDate: 2023-09-02
endDate: 2024-05-15
status: "completed"
technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Neon", "Drizzle ORM", "Clerk"]
categories: ["Non-profit", "Client Work"]
githubUrl: "https://github.com/JumboCode/Theatre-At-First"
favicon: "theatre.jpg"
priority: 4
achievements: ["Streamlined inventory tracking for 500+ items", "Reduced search time by 80%", "Photo upload & categorization system", "Location-based organization", "Condition tracking workflow"]
---

## Project Overview

Theatre@FIRST is an all-volunteer community theatre based in Somerville, MA, founded in 2003. As part of JumboCode's 2023-2024 cohort, I worked on a team to develop a comprehensive inventory management system to help them track their extensive collection of costumes, props, furniture, and other theatrical materials.

## The Problem

Theatre@FIRST had accumulated large quantities of theatrical items over their 20+ years of operation, but lacked an effective system to track what they owned, where items were stored, and what condition they were in. This made it difficult for designers to:
- Check item availability for productions
- Locate specific pieces within the theatre
- Assess the condition of items before use
- Plan for repairs or replacements

## Our Solution

We built a web-based inventory management system that allows Theatre@FIRST staff and volunteers to:

### Core Features
- **Item Cataloging**: Add detailed information about each inventory item including name, category, description, and tags
- **Photo Management**: Upload and manage multiple photos per item using Cloudinary integration
- **Location Tracking**: Assign specific storage locations within the theatre building
- **Condition Monitoring**: Track item condition (pristine, good, needs repair, unusable) with notes
- **Search & Filter**: Advanced search functionality by category, location, condition, and tags
- **Check-in/Check-out**: Track when items are borrowed for productions

### Technical Implementation
- **Frontend**: Built with React and TypeScript for type-safe, maintainable code
- **Backend**: Node.js/Express API with RESTful endpoints
- **Database**: MongoDB for flexible document storage of item data
- **Styling**: Tailwind CSS for responsive, modern UI design
- **Image Storage**: Cloudinary integration for optimized photo uploads and management

## Team Collaboration

This project was developed as part of JumboCode, where I worked alongside:
- **Leadership**: Liam Strand (Project Manager), Amitavv Nott (Tech Lead), An Tran (Designer)
- **Development Team**: 10 student developers including myself
- **Methodology**: Agile development with weekly sprints and client check-ins

## Impact & Results

The inventory system successfully addressed Theatre@FIRST's organizational challenges:
- Catalogued 500+ existing inventory items
- Reduced item search time from hours to minutes
- Enabled better production planning through accurate availability data
- Created a sustainable system for ongoing inventory management
- Provided training materials for volunteer staff

## Personal Contributions

As a developer on this project, I contributed to:
- Frontend component development and state management
- Database schema design and API endpoint implementation
- Photo upload functionality and image optimization
- Search and filtering features
- User interface design and responsive layouts
- Testing and quality assurance

## Technical Challenges

### Image Management
Implementing efficient photo uploads while maintaining performance required careful optimization of image compression and cloud storage integration.

### Data Relationships
Designing flexible database schemas to handle diverse inventory types while maintaining query performance across thousands of items.

### User Experience
Creating an intuitive interface that volunteers of varying technical skill levels could use effectively.

## Community Impact

This project directly supports Theatre@FIRST's mission of providing quality live theatre to the Davis Square community. By streamlining their operations, we enabled them to focus more time on creative work and less on administrative tasks.

The system continues to be actively used by Theatre@FIRST, helping them manage productions and maintain their extensive collection of theatrical materials for future shows.
