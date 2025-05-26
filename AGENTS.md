This is the root of the project (Sheru App Library).
This project is a hub to serve all applications developed by Sheru under the Sauce (one of the applications) theme.
This project as of 26/5/2025 contains 3 applications
 - Sauce (A social media platform inspired by 4chan and reddit)
 - Badge Maker (A PDF generating app)
 - CV (WIP for a single page application that will end up as the creator's primary CV)

The structure of the repo is as fowllows:
- helpers (supposed to be node files that have a singular and usually very specific purpose, that can be used across the whole app)
- public (the usual public folder definition of a web application's public folder)
- src (contains all of the primary code for the parent as well as sub applications)

Tech stack:
 - React
 - Vite
 - Typescript
 - ThreeJS
 - PWA
 - MUI
 - Vercel

Backend (no concrete implementation yet, using JSON server at the moment. Plans to replace soon with something a bit more robust):
- JSON server

Important to know:
dataTypeDefinitions.ts is the technical documentation of all forms of data that goes around across all apps. SO if there's any form of data in the apps, it is declared in this application to define what
its supposed to be across all its instances.
Readme.md contains extensive documentation of the entire project and all the breaking changes it has been through as well as the reasoning behind them.
