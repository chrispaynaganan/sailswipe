# SailSwipe — mobile app preview

An interactive prototype of **SailSwipe**, a mobile app that matches skippers with crew. Built from the Figma file so recruiters can click through the real flows. Designed by Chris Paynaganan.

On a desktop it shows inside a phone frame, with a "Things to try" checklist beside it. On a phone it fills the screen.

## What you can do

- **Sign in or register.** The forms validate, the password fields can be shown or hidden, and "Forgot password" walks through email, a 6-digit code with a countdown, a new password and a confirmation.
- **Swipe.** On Opportunities, Crew and Charters, drag a card right to message or left to pass. The buttons do the same.
- **Sailing profile.** Messaging needs a sailing profile, so the app asks you to make one first: four steps (About, Work, Expertise, Destinations), with a prompt if you leave with unsaved changes.
- **Messages.** Open a chat and send a message. A brand-new contact gets one message until they reply (they do, a few seconds later). Swipe a conversation left to archive it; restore it from Archive → Edit.
- **Your posts.** Add boats, post sailing opportunities or charters, and list gear for sale. Rows swipe left to edit or archive. Posting an opportunity without a boat asks you to create a boat first.
- **Marketplace.** Browse, search, and open a listing ("Read more", "Message").
- **Port Info.** Switch between Formalities, Cruising Reports and Related Business from the title menu, read a report or a country's formalities, and write your own report.
- **Settings.** Change your password, read About the App, log out.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS v4 (all design tokens in `src/app/globals.css`), Motion for animation, Urbanist via `next/font`.

- `src/components/SailSwipe.tsx`: app state, navigation stack, phone frame
- `src/components/ui.tsx`: shared pieces (tab bar, headers, fields, sheets, alerts, swipe rows)
- `src/components/screens/*`: the screens, grouped by area
- `src/lib/data.ts`: demo content
- `public/ic`, `public/img`: icons and photos exported from Figma

## Run it

```bash
npm install
npm run dev
```
