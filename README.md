
> # Sauce
>*A community driven resource sharing application*

**Sauce** is a simple application developed solely for research purposes. **Sauce** aims to provide it's users
with a convinient access to resources that may be harder to find via manual browsing.
The application's prominent features are:
1) Convinient sharing using shortened links
2) Stellar and blazing fast resource searching 
3) Points system to promote legitmacy
4) Completely anonymouse usage
5) Non comercial
---
### **Design**
Product properties
>Must haves
1) SHARE DATA (WHAT IS DATA? DATA: {Resource Name, Resource Value, Resource Description})
2) Data can be evalunted by other users on its legitimacy.
if (Resource === legit) ? upvote : downvote
3) Home feed based off of uprotes.
4) A report button to report inactive resources that were active before
5) No accounts system. Anyone can make a post without any signup and comment on it as well. Username will be generated automatically and kept track of locally via cookies.
>Nice to have
1) Topic based filtering to be able to look up resources with specific assosciations.
2) Resource requesting.
3) Feedbased off "Sauces" where audio based is mustard, more explicit is chili etc

#### *Will use JSON server till I get to the backend part.*
---
### Things I have learned due to this project
1) Being able to use two remotes simultaneously to push to.
2) How epic JSON server is
3) You can make a shitty DB out of Vercel cache (And it worked WOOO IT FEELS SO GOOD)!
4) MUI doesn't let u do OLED black as body BG (You need to tell it how ```!important``` it is)
5) for some messed up reason, iOS (as far as I can tell only iOS) scales your website to make font be 16px. In result destroying every formating. Need to put a meta tag on top to stop that. 
---
Yes. Sauce is inspired from the 6 digit sauce. 
---
## TODO:
1) Are you sure and provide a reason dialogue on report post.
2) <del>Creating a post formulier</del>
3) Post page
4) create a a comment formulier
5) <del>MUI theming</del>
6) Creating the UI proper once all functionality is online
7) Loaders for litteraly everything and check if all API calls are async
8) Once I have the loaders, redo the functionality on system to remove any dependency on localdata and make it completely live only.
9) <del>Make API URLs dynamic from .env to make it easy to deploy</del>
10) Sorting functionality on Home
11) Search functionality on Home
   
---

- Frontend Server: 
``` npm run dev ```
- Backend Server:
``` npx json-server db.json ```
- Vercel Prod URL
```https://sauce-weld.vercel.app/```


After multiple hours of scrootny and discovery, I have come to the conclusion, that the problem is in 
my function and not the makeshift cache backend in vercel cuz it's also breaking in onRender.
All be it, onRender does feel a bit more reliable as far as reliablity goes.
Need to look into as to why the likes array of user isn't being updated properly.