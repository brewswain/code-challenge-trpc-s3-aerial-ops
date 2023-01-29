# Aerial Ops Code challenge

## MVP Goals

- [x] Learn TRPC and Zod to a usable level (should add time to project; that's fine, ramp up should always be considered with deliverable timelines)
- [x] Create basic visual mockup of chat -- Not styled
- [x] Begin working on trpc for endpoint functionality
- [x] Use Mongo
- [ ] Create simple Chat room, no authentication
- [ ] Learn S3 (Should be simple, Experience with GCP and firebase will help out, so don't expect too much time investment outside of configuring to use **pre-signed Urls**)
- [ ] Deploy on Vercel
- [ ] Use S3

## Stretch Goals

- [x] use [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates) for `msg.add` and `msg.delete`

- [x] `msg.delete` should also delete any images

- [ ] ensure that `msg.list` returns messages | urls for displaying images if they exist

- [ ] implement [Mantine](https://mantine.dev/) for component library stuff (Might retrofit once I get base functionality down, this is lower priority since I have to learn TRPC and Zod first.)

## Fixes

- [ ] Fix Vercel build -- It just requires some .env setup, but isn't worth fixing until I begin wiring up backend functionality.

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
