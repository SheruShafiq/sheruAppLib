> # Sauce
>
> _A community driven resource sharing application_

**Sauce** is a simple application developed solely for research purposes. **Sauce** aims to provide it's users
with a convinient access to resources that may be harder to find via manual browsing.
The application's prominent features are:

1. Convinient sharing using shortened links
2. Stellar and blazing fast resource searching
3. Points system to promote legitmacy
4. Completely anonymouse usage
5. Non comercial

---

### **Design**

Product properties

> Must haves

1. SHARE DATA (WHAT IS DATA? DATA: {Resource Name, Resource Value, Resource Description})
2. Data can be evalunted by other users on its legitimacy.
   if (Resource === legit) ? upvote : downvote
3. Home feed based off of uprotes.
4. A report button to report inactive resources that were active before
5. No accounts system. Anyone can make a post without any signup and comment on it as well. Username will be generated automatically and kept track of locally via cookies.
   > Nice to have
6. Topic based filtering to be able to look up resources with specific assosciations.
7. Resource requesting.
8. Feedbased off "Sauces" where audio based is mustard, more explicit is chili etc

#### _Will use JSON server till I get to the backend part._

---

### Things I have learned due to this project

1. Being able to use two remotes simultaneously to push to.
2. How epic JSON server is
3. You can make a shitty DB out of Vercel cache (And it worked WOOO IT FEELS SO GOOD)!
4. MUI doesn't let u do OLED black as body BG (You need to tell it how `!important` it is)
5. for some messed up reason, iOS (as far as I can tell only iOS) scales your website to make font be 16px. In result destroying every formating. Need to put a meta tag on top to stop that.

---

## Yes. Sauce is inspired from the 6 digit sauce.

## Make shift JIRA Board:

1. Are you sure and provide a reason dialogue on report post.
2. <del>Creating a post formulier</del>
3. Post page
4. create a a comment formulier
5. <del>MUI theming</del>
6. Creating the UI proper once all functionality is online
7. Loaders for litteraly everything and check if all API calls are async
8. Once I have the loaders, redo the functionality on system to remove any dependency on localdata and make it completely live only.
9. <del>Make API URLs dynamic from .env to make it easy to deploy</del>
10. Sorting functionality on Home
11. Search functionality on Home
12. A user screen that shows all of user's posts
13. implementing categorisation
14. An effecienter way of handeling comments chain, where a comments chain is created inside the post as well to save API calls amount.
15. Add credits in the footer
16. Get giphy to prod
17. MUSIC
18. URL(ise) the paginated home
19. Comments don't have like and dilike options yet, not even in data structure
20. The error snackbar needs to have dev details that can be opened optionally.
21. Move to typescript (API res body(s) are a nightmare right now withou t types habing no idea what the hell to pass on and what to expect.)
22. Lazy LOAD
23. look into service workers
24. Giphy PROD
25. Move to NextJS if it's a smoother backend and easy enough setup.

TODO: For some reason there's a weird temporary empty array for like a second after mutation
TODO: Still not too hyped abt the comments solution

---

- Frontend Server:
  `npm run dev`
- Backend Server:
  <del>`npx json-server db.json`</del>
  `node server.cjs`
- Vercel Prod URL
  `https://sauce-weld.vercel.app/`

After multiple hours of scrootny and discovery, I have come to the conclusion, that the problem is in
my function and not the makeshift cache backend in vercel cuz it's also breaking in onRender.
All be it, onRender does feel a bit more reliable as far as reliablity goes.
Need to look into as to why the likes array of user isn't being updated properly.
