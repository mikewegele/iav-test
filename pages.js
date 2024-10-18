document.addEventListener('DOMContentLoaded', async () => {
    const getNewestVersion = async () => {
        return await fetch("./version-list.md")
            .then(response => response.text())
            .then(data => {
                const versions = data.trim().split('\n');
                return versions[0];
            })
    };
    const newestVersion = await getNewestVersion();
    const response = await fetch(`/iav-test/${newestVersion}/index.html`);
    console.log(response)
    const indexHTML = await response.text();
    document.open();
    document.write(indexHTML);
    document.close();
});
