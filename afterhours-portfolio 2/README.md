# Afterhours: Tanvi Gupta's portfolio

Plain HTML, CSS and JavaScript. No build step, no installs.

## Run it
1. Open this folder in VS Code (File > Open Folder).
2. Install the **Live Server** extension (VS Code suggests it).
3. Right-click `index.html` and choose **Open with Live Server**.

No VS Code? Run `python -m http.server 5500` in this folder and open http://localhost:5500

## Update it
- **Everything you edit lives in `js/content.js`**: projects, skills, timeline, hackathons, links and email.
- Add a project by copying one entry in `projects` and changing the text. Delete a `todo` line once you've added what it asks for.
- Colours and spacing: top of `css/style.css` (the `:root` block).
- Resume: put your PDF in this folder as `resume.pdf`. The Resume button starts working as soon as the file exists.
- Screenshots: put images in a new `images/` folder (this is where project previews can go next).

## Put it on GitHub
1. Create an empty repo named `afterhours-portfolio` at https://github.com/new (leave "Add a README" unticked).
2. In a terminal inside this folder:

```
git init
git add .
git commit -m "Add Afterhours portfolio"
git branch -M main
git remote add origin https://github.com/Tanvig12/afterhours-portfolio.git
git push -u origin main
```

## Host it free (GitHub Pages)
Repo > Settings > Pages > Source: **Deploy from a branch** > Branch: `main` / `(root)` > Save.
After a minute it is live at https://tanvig12.github.io/afterhours-portfolio/

## Update later
```
git add .
git commit -m "Update projects"
git push
```

## Hidden extras
Ctrl/Cmd+K opens quick jump. There are ten secrets to find; the footer counts them.

## Photos
Your photo is `images/tanvi.jpg` (a crop of the original). Swap the file, keep the name, or edit the `<img>` in `index.html`.

## Sound
The ambient sound is generated in the browser (no audio file). It is off until someone clicks the speaker.

## Cube and heart
The playground is 48 individually positioned CSS 3D blocks. The code is in `js/main.js` (search for `lay.heart` to edit the heart pattern).
