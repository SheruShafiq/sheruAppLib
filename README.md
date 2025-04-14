> # Sauce

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
6. GitHUB is an excellent file storage system API, it's free, rate limit of 1K and its fast and easy. So db.json is going there.
7. Render also doesnt persists for free (bitch), so github api it is.

---

## Make shift JIRA Board:

1. Are you sure and provide a reason dialogue on report post.
2. <del>Creating a post formulier</del>
3. <del>Post page</del>
4. <del>create a a comment formulier</del>
5. <del>MUI theming</del>
6. <del>Creating the UI proper once all functionality is online</del>
7. <del>Loaders for litteraly everything and check if all API calls are async</del>
8. <del>Once I have the loaders, redo the functionality on system to remove any dependency on localdata and make it completely live only.</del>
9. <del>Make API URLs dynamic from .env to make it easy to deploy</del>
10. Sorting functionality on Home
11. Search functionality on Home
12. A user screen that shows all of user's posts, and comments
13. implementing categorisation
14. <del>An effecienter way of handeling comments chain, where a comments chain is created inside the post as well to save API calls amount.</del>
15. <del>Add credits in the footer</del>
16. MUSIC
17. <del>URL(ise) the paginated home</del>
18. <del>Comments don't have like and dilike options yet, not even in data structure</del>
19. <del>The error snackbar needs to have dev details that can be opened optionally.</del>
20. <del>Move to typescript (API res body(s) are a nightmare right now withou t types habing no idea what the hell to pass on and what to expect.)</del>
21. <del> For some reason there's a weird temporary empty array for like a second after mutation</del>
22. Lazy LOAD
23. look into service workers
24. Giphy PROD
25. Move to NextJS if it's a smoother backend and easy enough setup. 26. Need to check for overflows on things like posts, comments, resource description etc on giga long texts. Breaks sometimes on mobile it seems.
26. Add readmore toggle to descriptions and comments too long. Add a text size limit on displayName
27. Add a check if username and password already exist
28. Overflow issues on home
29. Upvoted posts and downvoted posts in users object doesnt seem to work as intended
30. Categories PostsID array is also not working as intended
31. Better error handeling when post ID in URL is wrong
32. On Post page, user's profile who posted it needs to be implemented
33. Loaders for commenting, replying
34. <del>BUG: post title is clickable on post page</del>
35. <del>Create post loader keeps going on live for some reason</del>
36. ThreeJS 404 page after basic exams
37. The right section of post page will be "other posts from this user" or something

---

- Frontend Server:
  `npm run dev`
  - ENV variables:
    - VITE_BACKEND_URL
    - VITE_GIPHY_API_KEY
- Backend Server:
  `node index.cjs`
  - ENV variables:
    - GITHUB_SYNC (true | false)
    - GITHUB_TOKEN
    - DB_NAME
- Vercel Prod URL
  <a href="https://sauce-weld.vercel.app/">https://sauce-weld.vercel.app/</a>
- Render Backend Prod URL
  <a href="https://saucebackend.onrender.com/">https://saucebackend.onrender.com/</a>

---

> Notes of insanity (A log of shit I did, and lost life years overw )
> After multiple hours of scrootny and discovery, I have come to the conclusion, that the problem is in
> my function and not the makeshift cache backend in vercel cuz it's also breaking in onRender.
> All be it, onRender does feel a bit more reliable as far as reliablity goes.
> Need to look into as to why the likes array of user isn't being updated properly.

#### Yes. Sauce is inspired from the 6 digit sauce.
