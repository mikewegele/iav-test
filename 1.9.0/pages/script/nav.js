/**
 * Copyright © 2024 IAV GmbH Ingenieurgesellschaft Auto und Verkehr, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

let basePath = '/iav-test';

document.addEventListener('DOMContentLoaded', async () => {
    const newestVersion = await getNewestVersion();
    const response = await fetch(`${basePath}/${newestVersion}/index.html`)
    const indexHTML = await response.text();
    document.open();
    document.write(indexHTML);
    document.close();
    document.getElementById('header-container').innerHTML = await fetchData(`${basePath}/${newestVersion}/pages/html/header.html`);
    document.getElementById('footer-container').innerHTML = await fetchData(`${basePath}/${newestVersion}/pages/html/imprint-footer.html`);
    document.getElementById('nav-placeholder').innerHTML = await fetchData(`${basePath}/${newestVersion}/pages/html/nav.html`);
    let fileName = extractFileNameFromURL(window.location.href)
    if (fileName === "index.html") {
        fileName = "overview.html"
        pushWindowState(`${basePath}/${newestVersion}/${fileName}`)
        await loadPage(fileName)
    }
    await loadVersionDropdown()
    await loadPage(fileName)
    await loadPageNav();
    createPageNavigation();
});

const getNewestVersion = async () => {
    return await fetch("../version-list.md")
        .then(response => response.text())
        .then(data => {
            const versions = data.trim().split('\n');
            return versions[0];
        })
};

const getSelectedVersion = () => {
    const versionDropdown = document.getElementById('versionDropdown');
    return versionDropdown.value;
}

const pushWindowState = (path) => {
    window.history.pushState({}, '', path);
}

const navigate = async (url, version = null) => {
    const currentVersion = version || await getSelectedVersion();
    const expectedPath = `${basePath}/${currentVersion}/${url}`;
    const currentPath = window.location.pathname;
    if (currentPath !== expectedPath) {
        window.history.pushState({}, '', expectedPath);
    }
    document.getElementById('container').innerHTML = await fetchData(expectedPath);
    createPageNavigation();
}

const fetchData = async (path) => {
    const response = await fetch(path);
    return response.text();
}

const extractFileNameFromURL = (url) => {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
}

const loadPage = async (url) => {
    document.getElementById('container').innerHTML = await fetchData(`${url}`);
}

const loadPageNav = async () => {
    const version = getSelectedVersion();
    fetch(`${basePath}/${version}/pages/html/page-nav.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('page-placeholder').innerHTML = data;
            const navList = document.getElementById('nav-list');
            const headers = document.querySelectorAll('h1, h2');
            headers.forEach(header => {
                const listItem = document.createElement('li');
                listItem.classList.add(header.tagName.toLowerCase());
                const link = document.createElement('a');
                link.textContent = header.textContent;
                link.href = `#${header.id || header.textContent.replace(/\s+/g, '-').toLowerCase()}`;
                listItem.appendChild(link);
                navList.appendChild(listItem);
            });
        });
}

const createPageNavigation = () => {
    document.getElementById('nav-list').innerHTML = '';
    const container = document.getElementById('container');
    const pagePlaceholder = document.getElementById('nav-list');
    const navList = document.createElement('ul');
    const headers = container.querySelectorAll('h1, h2');
    headers.forEach((header) => {
        const listItem = document.createElement('li');
        listItem.classList.add(header.tagName.toLowerCase());
        const link = document.createElement('a');
        link.textContent = header.textContent;
        link.href = `#${header.id || header.textContent.replace(/\s+/g, '-').toLowerCase()}`;
        listItem.appendChild(link);
        navList.appendChild(listItem);
    });
    pagePlaceholder.appendChild(navList);
}

const loadVersionDropdown = async () => {
    const versionResponse = await fetch("../version-list.md");
    const versionText = await versionResponse.text();
    console.log(versionText)
    const versionDropdown = document.getElementById('versionDropdown');
    const versions = versionText.split('\n').filter(line => line.trim() !== '');
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        versionDropdown.appendChild(option);
    });
    versionDropdown.addEventListener('change', function() {
        const selectedVersion = this.value;
        navigate("overview.html", selectedVersion)
    });
}