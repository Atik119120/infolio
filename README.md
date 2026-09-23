# infolio

আমি একটি full-stack web application তৈরি করতে চাই যার কাজ হবে users দের জন্য automated personal portfolio website তৈরি করা।

Core Features:

1. Authentication System

User registration & login (email + password)

প্রতিটা user এর জন্য আলাদা dashboard

Login না করলে কোনো page access করা যাবে না



2. User Dashboard

Login করার পর user একটি dashboard পাবে

Dashboard এ থাকবে:

Profile info edit করার option

Portfolio website manage করার option

Custom domain / subdomain manage করার option




3. Portfolio Builder (Form Based)

User dashboard এ ঢোকার পর একটি multi-step form থাকবে

Form fields:

Name

Bio / About Me

Profile Image upload

Skills

Projects (title, description, link, image)

Social links

Contact info


User form submit করলে automatically একটি pre-designed theme/template এ data render হবে



4. Theme System

Initially 1টা clean, modern portfolio theme থাকবে

Theme dynamic হবে (data database থেকে load হবে)

Future এ multiple themes add করা যাবে এমন structure



5. Live Portfolio Website

Form submit করার সাথে সাথে user এর personal portfolio website live হয়ে যাবে

URL structure:

username.ourdomain.com (default subdomain)


User চাইলে নিজের custom domain connect করতে পারবে



6. Edit & Update System

User যেকোনো সময় dashboard এ ঢুকে:

Content edit করতে পারবে

New project add/remove করতে পারবে

Images update করতে পারবে


Changes instantly live website এ reflect হবে



7. Tech & Architecture

Frontend: modern responsive UI

Backend: API based architecture

Database: user, portfolio data, domain mapping

Secure authentication & authorization

Scalable structure (multi-user support)



8. Admin Ready Structure

Future এ admin panel add করা যাবে

Admin চাইলে users, themes, subdomains manage করতে পারবে




Goal: এই system টা হবে একটা SaaS-style platform যেখানে users খুব সহজে কোনো coding ছাড়াই নিজের personal portfolio website বানাতে পারবে।


---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://infolio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bb03667f-56a5-4aa9-848a-2b5108ef7569).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
