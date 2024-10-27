import fs from "fs";

const reg = /({.*"lyrics":)"([^`]*?)"(.*?})/g;

const result = fs.readFileSync("./sinhala_songs_corpus.json", {
  encoding: "utf-8",
});

let lyricsArr = [];

for (const i of result.matchAll(reg)) {
  const first = i[1];
  const lyrics = i[2].replaceAll("\n", "\\n");
  const end = i[3];

  const l = JSON.parse(first + '"' + lyrics + '"' + end);
  l.lyrics = l.lyrics.split("\n").map((line) => line.trim());
  l.submitted_by = "unknown";

  const lyricsCopy = l.lyrics;
  l.lyrics = [];
  let section = [];
  for (const line of lyricsCopy) {
    if (line === "") {
      l.lyrics.push(section);
      section = [];
    } else {
      section.push(line);
    }
  }

  if (section.length > 0) l.lyrics.push(section);

  lyricsArr.push(l);
}

fs.writeFileSync("./lyrics.json", JSON.stringify(lyricsArr, null, 2));
