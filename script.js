const getCatButton = document.getElementById('get-cat-image');
const catImage = document.getElementById('cat-image');
const tagsSelect = document.getElementById('tags-select');

getCatButton.addEventListener('click', async () => {
    const image = await getCatImage();
    if(!image) return;
    catImage.setAttribute('src', `https://cataas.com${image.url}`);
});

async function getCatImage () {
    getCatButton.setAttribute('disabled', 'true');
    setTimeout(() => {
        getCatButton.removeAttribute('disabled');
    }, 1500);
    const tags = tagsSelect.value === 'Без тегов' ? '' : `/${tagsSelect.value}`;
    const answer = await fetch(`https://cataas.com/cat${tags}?json=true`);
    if(answer.status !== 200) return false;
    const result = await answer.json();
    return result;
}

async function getAllTags () {
    const answer = await fetch('https://cataas.com/api/tags');
    if(answer.status !== 200) return false;
    const result = await answer.json();
    for(let i = 1; i < result.length; i++){
        const option = document.createElement('option');
        option.value = result[i];
        option.innerHTML = result[i];
        tagsSelect.appendChild(option);
    }
}

getAllTags();