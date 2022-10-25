const getCatButton = document.getElementById("get-cat-image");
const catImage = document.getElementById("cat-image");
const tagsSelect = document.getElementById("tags-select");
const graphqlContainer = document.getElementsByClassName('last')[0];

getCatButton.addEventListener("click", async () => {
  const image = await getCatImage();
  if (!image) return;
  catImage.setAttribute("src", `https://cataas.com${image.url}`);
});

async function getCatImage() {
  getCatButton.setAttribute("disabled", "true");
  setTimeout(() => {
    getCatButton.removeAttribute("disabled");
  }, 1500);
  const tags = tagsSelect.value === "Без тегов" ? "" : `/${tagsSelect.value}`;
  const answer = await fetch(`https://cataas.com/cat${tags}?json=true`);
  if (answer.status !== 200) return false;
  const result = await answer.json();
  return result;
}

async function getAllTags() {
  const answer = await fetch("https://cataas.com/api/tags");
  if (answer.status !== 200) return false;
  const result = await answer.json();
  for (let i = 1; i < result.length; i++) {
    const option = document.createElement("option");
    option.value = result[i];
    option.innerHTML = result[i];
    tagsSelect.appendChild(option);
  }
}

async function sendRequerstGraphQL() {
  const answer = await fetch("https://www.learnwithjason.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetLearnWithJasonEpisodes($now: DateTime!) {
        allEpisode(limit: 10, sort: {date: ASC}, where: {date: {gte: $now}}) {
            date
            title
            guest {
            name
            twitter
            }
            description
        }
        }
      `,
      variables: {
        now: new Date().toISOString(),
      },
    }),
  });
  const result = await answer.json();
  result.data.allEpisode.forEach(element => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('col-8');
    wrapper.classList.add('mb-3');
    wrapper.classList.add('d-flex');
    wrapper.classList.add('flex-column');
    wrapper.classList.add('align-items-center');
    wrapper.classList.add('graphQLBLock');
    
    const title = document.createElement('h1');
    title.innerHTML = element.title;
    title.classList.add('mb-3');
    wrapper.appendChild(title);

    const desc = document.createElement('h2');
    desc.innerHTML = element.description;
    desc.classList.add('text-wrap');
    desc.classList.add('opacity-75');
    wrapper.appendChild(desc);

    graphqlContainer.appendChild(wrapper);
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/cash.js").then(
      (reg) => {
        console.log("SW registred " + reg.scope);
      },
      (err) => {
        console.log("SW error " + err);
      }
    );
  });
}

getAllTags();
sendRequerstGraphQL();
