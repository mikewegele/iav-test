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

const getCurrentVersion = async () => {
    return await fetch('../version-list.md')
        .then(response => response.text())
        .then(data => {
            const versions = data.split('\n').filter(Boolean);
            return versions[0];
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();
    fetch(`${currentVersion}/pages/html/nav.html`)
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.getElementById('nav-placeholder').innerHTML = data;
        });
});

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();
    fetch(`${currentVersion}/pages/html/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });
});

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();
    fetch(`${currentVersion}/pages/html/imprint-footer.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
});

document.addEventListener('DOMContentLoaded', async function () {
    const currentVersion = await getCurrentVersion();
    fetch(`${currentVersion}/pages/html/nav.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('drawer').innerHTML = data;
            const currentPath = window.location.pathname.split('/').pop();
            const links = document.querySelectorAll('.drawer a');
            links.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        });
});

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();
    fetch(`${currentVersion}/pages/html/page-nav.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('page-placeholder').innerHTML = data;

            const navList = document.getElementById('nav-list');
            const headers = document.querySelectorAll('h1, h2');
            console.log(headers)
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
});

function loadVersions() {
    fetch('../version-list.md')
        .then(response => response.text())
        .then(data => {
            const versions = data.split('\n').filter(Boolean);
            const dropdown = document.getElementById('versionDropdown');
            console.log(document)
            console.log(document.getElementById("header-container"))
            const currentVersion = window.location.pathname.split('/')[window.location.pathname.split('/').length - 2];

            versions.forEach(version => {
                const option = document.createElement('option');
                option.value = version;
                option.textContent = version;
                if (version === currentVersion) {
                    option.selected = true;
                }
                dropdown.appendChild(option);
            });

            dropdown.addEventListener('change', function() {
                const selectedVersion = this.value;
                const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -2).join('/');
                window.location.href = `${baseUrl}/${selectedVersion}/index.html`;
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Versionen:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadVersions);

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();
    console.log("HERE IST THE VERSION" + currentVersion)
    console.log(currentVersion)
    fetch(`${currentVersion}/overview.html`)
        .then(response => {
            console.log(response)
            return response.text();
        })
        .then(html => {
            console.log(html)
            document.getElementById('container').innerHTML = html;
            generatePageNavigation();
        })
        .catch(error => {
            console.error('Fehler beim Laden der HTML-Datei:', error);
        });
});

async function navigate(url, version = null) {
    const currentVersion = version || await getCurrentVersion();
    fetch(`${currentVersion}/${url}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('container').innerHTML = html;
            generatePageNavigation();
        })
        .catch(error => {
            console.error('Fehler beim Laden der HTML-Datei:', error);
        });
}

function generatePageNavigation() {
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

document.addEventListener('DOMContentLoaded', async () => {
    const currentVersion = await getCurrentVersion();

    fetch(`${currentVersion}/pages/html/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            loadVersionDropdown();
        });

    async function loadVersionDropdown() {
        try {
            const versionResponse = await fetch(`version-list.md`);
            const versionText = await versionResponse.text();

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
                console.log(selectedVersion)
                navigate("overview.html", selectedVersion)
            });

        } catch (error) {
            console.error('Fehler beim Laden der Versionen:', error);
        }
    }
});
