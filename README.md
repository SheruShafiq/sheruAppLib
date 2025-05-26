> # Sauce

> _A community driven resource sharing application_

**Sauce** is a simple application developed solely for research purposes. **Sauce** aims to provide it's users
with a convinient access to resources that may be harder to find via manual browsing. The reason I started this project was
for the frontend exam at Uni. Hence the funny backend, that will be replaced with a proper one when I get to backend exam.

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
3. Home feed based off of upvotes.
4. A report button to report inactive resources that were active before
5. <del>No accounts system. Anyone can make a post without any signup and comment on it as well. Username will be generated automatically and kept track of locally via cookies.</del>

> Nice to have 6. Topic based filtering to be able to look up resources with specific assosciations. 7. Resource requesting. 8. Feedbased off "Sauces" where audio based is mustard, more explicit is chili etc

#### _Will use JSON server till I get to the backend exam._

---

### Things I have learned due to this project

1. Being able to use two remotes simultaneously to push to.
2. How epic JSON server is
3. You can make a shitty DB out of Vercel cache (And it worked WOOO IT FEELS SO GOOD)!
4. MUI doesn't let u do OLED black as body BG (You need to tell it how `!important` it is)
5. for some messed up reason, iOS (as far as I can tell only iOS) scales your website to make font be 16px. In result destroying every formating. Need to put a meta tag on top to stop that.
6. GitHUB is an excellent file storage system API, it's free, rate limit of 1K and its fast and easy. So db.json is going there.
7. Render also doesnt persists for free (bitch), so github api it is.
8. Node has a maximum string length
9. What are webworkers, progressive web apps and how to do a loading bar
10. I might not be as good of a dev as I thought I was
11. I know very little in the grand scheme of things of web app development and should send a formal appology to both Rein and Erik
12. position sticky requires top to defined
13. Web workers are cool as shit, but I dont think I'll have another use case anytime soon.

---

## Make shift JIRA Board cuz why would a single dev make a whole ass board:

2. <del>Creating a post formulier</del>
3. <del>Post page</del>
4. <del>create a a comment formulier</del>
5. <del>MUI theming</del>
6. <del>Creating the UI proper once all functionality is online</del>
7. <del>Loaders for litteraly everything and check if all API calls are async</del>
8. <del>Once I have the loaders, redo the functionality on system to remove any dependency on localdata and make it completely live only.</del>
9. <del>Make API URLs dynamic from .env to make it easy to deploy</del>
10. <del>An effecienter way of handeling comments chain, where a comments chain is created inside the post as well to save API calls amount.</del>
11. <del>Add credits in the footer</del>
12. <del>URL(ise) the paginated home</del>
13. <del>Comments don't have like and dilike options yet, not even in data structure</del>
14. <del>The error snackbar needs to have dev details that can be opened optionally.</del>
15. <del>Move to typescript (API res body(s) are a nightmare right now withou t types habing no idea what the hell to pass on and what to expect.)</del>
16. <del> For some reason there's a weird temporary empty array for like a second after mutation</del>
17. <del>look into service workers</del>
18. <del>Giphy PROD</del>
19. <del>Add readmore toggle to descriptions and comments too long. Add a text size limit on displayName</del>
20. <del>Need to check for overflows on things like posts, comments, resource description etc on giga long texts. Breaks sometimes on mobile it seems.</del>
21. <del>Overflow issues on home</del>
22. <del>Upvoted posts and downvoted posts in users object doesnt seem to work as intended</del>
23. <del>On Post page, user's profile who posted it needs to be implemented</del>
24. <del>Loaders for commenting, replying</del>
25. <del>Sorting functionality on Home</del>
26. <del>BUG: post title is clickable on post page</del>
27. <del>earch functionality on Home 12.</del>
28. <del> A user screen that shows all of user's posts, and comments</del>
29. <del>Create post loader keeps going on live for some reason</del>
30. <del> The right section of post page will be "other posts from this user" or something</del>
31. <del>Now that I have giphy prod I can randomly assign media to posts! based off of post title and description!!</del>
32. <del>[BUG] IN userprofile Page Header is not getting the currentlogged in User data but the user's data of the page</del>
33. <del>[BUG] In user profile page Comments are not getting their author's username</del>
34. [Refactor] Giphy API shouldnt be making fetch calls for GIFs every time, but only on creation endpoints
35. [Feature] Are you sure and provide a reason dialogue on report post.
36. [Feature] ThreeJS 404 page after basic exams
37. <del>Categories's PostsID array is also not working as intended</del>
38. <del>[BUG] Better error handeling when post ID in URL is wrong</del>
39. [Feature] Add a check if username and password already exist
40. [Feature] Lazy LOAD (where applicable)
41. [Feature] MUSIC
42. [Feature] implementing categorisation with category based pages and filtering
43. [BUG] Comments chain overflow on mobile
44. [Feature] Infinite scroll on posts and comments
45. [Feature] Left bar on home with quick links around the sheru app librar
46. [Expansion] Sheru app library
47. [Feature] Shareable links of posts
48. [Security] Backend LIVE server only accepts requests from frontend LIVE server
49. [Bug not bug?] Posts should technically scroll backup on pagination change, but then again the final idea is infinite scroll so..... idk?
50. [DB Error] On prod, one of the user's(dev) liked posts array contains ID: 0. Which is non existing. I'll try to see if thats new or always been there. Also the error snckbar is blanco, gotta look into that as well.
51. [Feature] Edit and delete posts/comments if user is owner or super user
52. [Feature] Admin dashboard to manage existing categories and such
53. [Feature] Dont force 3D backdrop, ask user I guess? Or make it a toggle?
54. [MaybeBUG?] 3D model can just unalive itself if you are on a different tab
55. [Featuer expansion] Interactions like liking or disliking are locked behind an account system, but posting and commenting isnt.
56. [Dating crypto app] Track the streets your partner has been to, every relation is more than a relation, its TANGIBLE.
57. <del>[Feature] PDF generation is blocking UI thread and is slow as shit, move it to either server or something else. The current speed is unacceptable</del>
58. New Project!! Remote Parsec activator.
     - Uses a random github file as status (so no cold start, aka no delay)
     - Windows service to ping every hour or so
     - Webpage to update
     - SFW and NSFW version with a spread.
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
    - FRONTEND_URL
- Vercel Prod URL
  <a href="https://sauce-weld.vercel.app/">https://sauce-weld.vercel.app/</a>
- Render Backend Prod URL
  <a href="https://saucebackend.onrender.com/">https://saucebackend.onrender.com/</a>

---

> ## Notes of insanity (A log of shit I did, and lost life years overw )

- After multiple hours of scrootny and discovery, I have come to the conclusion, that the problem is in
  my function and not the makeshift cache backend in vercel cuz it's also breaking in onRender. All be it, onRender does feel a bit more reliable as far as reliablity goes. Need to look into as to why the likes array of user isn't being updated properly.
- So, after years being take of my life for each export off of badgeMaker. Apparently jsPDF has a bug, the librry itself that exports the entire export in a single string, a string so long (when 200+ badges) that node crashes as it exceeds the maximum
  length. So thank lord, some guy in the tickets made a fork with a fix cuz the bastards themselves refuse to take the PR in.
- ALSO HOLY SHIT I MANAGED TO MOVE THE WHOLE THING TO TYPESCRIPT
- I do need to double check some logic, there's too much of "Why would u do that" going on in functions for sauce app.
- Holy shit balls, figuring out an effecient way to generate DOM elements as PDFs is a bitch. I tried moving the logic to server, as backend languages tend to be multi theaded and this much most compared to abusing the singular UI thread on my browser. But hey, I have some ideas.
- Idea 1: Lets send the whole DOM over network to the server, that oughta work right? NOPE. Its breaking all sorts of styles due to missing inherited styles...
- Idea 2: Alright, what if I rewrote the whole thing in HTML/CSS in the backend. Inconssistent, so inconsistent compared to what's on the frontned. Its actually embarassing.
- Idea 3: Okay okay hold on. PUPETEER! Lets have some headless clients running in the backend using Node, an- STFU. Why the fuck would you just replicate the problem you have in the frontend in the backend. Its litteraly what ARM did, they moved the pain from x86 to software instead. 
- Okay, webworkers. Holy shit. SO cool, but my god the usecase are far and few between. Regardless, Iam extremely happy with the fact that I got em working. PDF generation time is almost half when the work is divided on 2 worker threads. All be it, the issue
  regarding the browser slowing down when window not focused continues, and might only be resolved via Electron. Need to figure that out yet tho. 
Was a bitch to setup... thanks Claude.
- Implemented a nicer Excel input that supports pasting spreadsheet rows and logs all input to the database.
- Idea (Hans): Hans also low key cooked, what if I made an image of the BG once, sent that to backend and let is loop over that image. That would be THE fastest way to generate badges. Some downsides tho, its not gonna be as accurate, cuz now shtits not caluclated anymore.

---

> # Future

I am far too happy with the setup of this website, the frontend I mean. So happy in fact that I want to make it an Apps library. Where sauce and badgeMaker are one of the apps.
I want to be able to host all sorts of apps here, my own CV with a GIF for a pfp like those harry potter newspapers, any tool I need like a pasteBin or something?
Or just anything cool really, whatever tools I use on a regular basis, and then make a full fledged little web app store of apps of my own.

---

#### Yes. Sauce is inspired from the 6 digit sauce.
