document.addEventListener('DOMContentLoaded', () => {
    const repoDescription = "idk";
    const languageComposition = [
        { name: "JavaScript", percent: 55.7 },
        { name: "CSS", percent: 23.6 },
        { name: "HTML", percent: 20.7 }
    ];

    // Display Repository Description
    const descriptionElement = document.getElementById('repo-description');
    descriptionElement.textContent = repoDescription;

    // Display Language Composition
    const languageListElement = document.getElementById('language-composition');
    languageComposition.forEach(language => {
        const listItem = document.createElement('li');
        listItem.textContent = `${language.name}: ${language.percent}%`;
        languageListElement.appendChild(listItem);
    });
});
