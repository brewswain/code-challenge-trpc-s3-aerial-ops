# Aerial Ops Code challenge

## MVP Goals

- [x] Learn TRPC and Zod to a usable level (should add time to project; that's fine, ramp up should always be considered with deliverable timelines)
- [x] Create basic visual mockup of chat -- Not styled
- [x] Begin working on trpc for endpoint functionality
- [x] Use Mongo
- [x] Learn S3 ~~(Should be simple, Experience with GCP and firebase will help out, so don't expect too much time investment outside of configuring to use **pre-signed Urls**)~~ Update I was so, so wrong 😭
- [x] Use S3
- [x] Create simple Chat room, no authentication
- [x] Deploy on Vercel

## Stretch Goals

- [x] use [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates) for `msg.add` and `msg.delete`

- [x] `msg.delete` should also delete any images

- [ ] implement [Mantine](https://mantine.dev/) for component library stuff (Might retrofit once I get base functionality down, this is lower priority since I have to learn TRPC and Zod first.)
- [ ] Cursor-based pagination

- [ ] A jest test to ensure that pagination is working properly with a badge on the README to indicate status

  ![Test Pagination](https://github.com/brewswain/code-challenge-trpc-s3-aerial-ops/actions/workflows/test-pagination.yaml/badge.svg)

## Fixes

- [x] Fix Vercel build -- ~~It just requires some .env setup, but isn't worth fixing until I begin wiring up backend functionality.~~ Fixed

#### Feedback fixes

---

- [x] You manually handle time display. You should use dayjs or moments.js
- [x] The website doesn't scroll down after submitting a message (although there seems to be code to do that)
- [x] your code does not support optimistic updates, although the feature seems to work on yoru webiste
- [x] You use console.log / alert for errors. You should probably display the error back to the user; you may have to return a value in trpc and then figure out a way to display that error.

---

## Work Summary

### Jan 26th, 2023

#### 3:40PM

---

So far, I spent most of today just doing some research on trpc and zod, including messing around with our built in API routes. Also did some intermittent work on overall UI and project structure using some mock data to ensure my flow is working as expected--Maybe 2.5 hours of actual coding done so far. Next goal is to learn and use Prisma to create some schemas--While I don't have experience with Prisma, it seems well-documented + this isn't anything new to me, i'll just have to learn syntax.

### Jan 27th, 2023

Today's work is heavily based on our actual functionality -- tRPC and Prisma. So far, I created the requested routes, and will begin testing them once I wire up the frontend.

#### 10:30AM

---

tRPC endpoints to list and send new messages confirmed working with mongo. Websocket implementation started. Roughly 3 hours of work done so far, bringing total average tally up to 5.5 hours.
Considering I'm learning a couple new technologies as well as implementing some websocket stuff,this is pretty on track with my expectations. Unfortunately however, it doesn't seem like I'll be able to get muc more work done today due to unforseen circumstances.

### Jan 30th, 2023

---

My schedule got messed up on friday and carried over to most of the weekend, But I was able to get through majority of functionality today. Working with S3 in particular took me way more time than expected, learning to use signed URLs took up way more time than expected, especially because it took me a while to give up on passing my image directly to my router to handle upload--AWS documentation isn't very friendly for picking up new concepts, but the complete flow makes way more sense to me now. This took a solid 3 hours to get functional, but with this, all the base functionality is completed. The next step is to do some simple styling/UX improvement.

#### 5:07 PM

---

Styling completed. Total Time tally taken, about 9.5 hours of coding, not counting time spent researching ambiently throughout the course of the day, etc. Overall, S3 implementation took me the most time to get through, including a couple nasty red herrings and silly thought flows. Realistically, both of these issues would be solved easier in a workforce since I would have hit my timebox limit way before doing it solo. That being said, I ended up learning quite a bit about the S3 system, so that's pretty cool.

The final goals are to work on stretch goals post-submission; this project was super fun disregarding the frustration of AWS' DX (But the payoff is so worth it, AWS is super powerful and just works™️, so I never doubted that all issues were my own to fix)

#### 6:34PM

---

Deployment issue ironed out, ready for Submission. As said, I'll continue doing stretch goals since this project has a bunch of super cool functionality baked into it and I want to explore everything!
