
<h1 align="center">RAID Calculator</h1>
<p align="center">💽 <i>Compare capacity, speed and fault tolerance of different RAID configurations</i></p>

<a href="https://raid-calculator.as93.net">
<p align="center">
  <img width="600" src="https://github.com/Lissy93/raid-calculator/blob/main/public/banner.png?raw=true" />
  </p>
</a>

---

### About

Simple tool for comparing RAID configurations based on the number of disks you have, and their capacity.<br>
Calculates the approximate usable capacity, speed gain and fault tolerance of common RAID configurations.

A live demo is hosted at [raid-calculator.as93.net](https://raid-calculator.as93.net)

---

### Developing

#### Prerequisites
You'll need Node.js installed, as well as Git and optionally Docker.
The app is built with Van.js

#### Setup Commands

```
git clone git@github.com:Lissy93/raid-calculator.git
cd raid-calculator
yarn
yarn dev
```

---

### Deploying

#### Option 1
Follow the developing instructions above. Then run `yarn build` to compile output<br>
You can then upload the contents of `./dist` to any web server, CDN or static host.

#### Option 2
Fork the repo, and import into Vercel, Netlify or any static hosting provider of your choice.

#### Option 3
Build the Docker image from the Dockerfile with `docker build -t raid-calculator .`<br>
And then start the container, by running `docker run -p 8080:80 raid-calculator`

---

### Contributing
Contributions are welcome.<br>
Follow the Developing instructions above to get started, and then submit your changes as a PR.<br>
If you're new to GitHub or open source, take a look at [git-in.to](https://git-in.to) for a guide on getting started.

---

<!-- License + Copyright -->
<p  align="center">
  <i>© <a href="https://aliciasykes.com">Alicia Sykes</a> 2024</i><br>
  <i>Licensed under <a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a></i><br>
  <a href="https://github.com/lissy93"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <sup>Thanks for visiting :)</sup>
</p>

<!-- Dinosaur -->
<!-- 
                        . - ~ ~ ~ - .
      ..     _      .-~               ~-.
     //|     \ `..~                      `.
    || |      }  }              /       \  \
(\   \\ \~^..'                 |         }  \
 \`.-~  o      /       }       |        /    \
 (__          |       /        |       /      `.
  `- - ~ ~ -._|      /_ - ~ ~ ^|      /- _      `.
              |     /          |     /     ~-.     ~- _
              |_____|          |_____|         ~ - . _ _~_-_
-->
