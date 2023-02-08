
'use strict';

async function onSubmit() {
    if (!validateForm())
        return;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await login(username, password)
    if (!validateResponse()) {
        displayErrorMessage(response.ResultMessage);
        return;
    }

    displayEntityDetails(response);

    function validateForm() {
        const form = document.getElementById('login')
        form.classList.add('was-validated');
        return form.checkValidity();
    }

    function validateResponse() { return !!response && (!response.ResultCode || response.ResultCode !== -1); }

    function displayErrorMessage() {
        const errorMessageElement = document.getElementById('error-message');

        errorMessageElement.classList.remove('d-none');
        errorMessageElement.textContent = `${response.ResultMessage}!`;
    }

    function displayEntityDetails(data) {
        document.getElementById('entity-details').classList.remove('d-none');
        document.getElementById('login').classList.add('d-none');

        document.getElementById('entity-id').value = data.EntityId;
        document.getElementById('first-name').value = data.FirstName;
        document.getElementById('last-name').value = data.LastName;
        document.getElementById('company').value = data.Company;
        document.getElementById('address').value = data.Address;
        document.getElementById('city').value = data.City;
        document.getElementById('country').value = data.Country;
        document.getElementById('zip').value = data.Zip;
        document.getElementById('phone').value = data.Phone;
        document.getElementById('mobile').value = data.Mobile;
        document.getElementById('email').value = data.Email;
        document.getElementById('email-confirm').checked = data.EmailConfirm;
        document.getElementById('mobile-confirm').checked = data.MobileConfirm;
        document.getElementById('country-id').value = data.CountryID;
        document.getElementById('status').value = data.Status;
        document.getElementById('lid').value = data.lid;
        document.getElementById('ftp-host').value = data.FTPHost;
        document.getElementById('ftp-port').value = data.FTPPort;
    }
}

async function login(username, password) {
    return await fetch('https://isapi.icu-tech.com/icutech-test.dll/soap/IICUTech', {
        method: 'POST',
        body: `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ICUTech.Intf-IICUTech">
        <soapenv:Header/>
        <soapenv:Body>
           <urn:Login soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <UserName xsi:type="xsd:string">${username}</UserName>
              <Password xsi:type="xsd:string">${password}</Password>
           </urn:Login>
        </soapenv:Body>
     </soapenv:Envelope>`
    })
        .then(response => response.text())
        .then(data => proccessData(data))
        .catch(error => processError(error));

    function proccessData(data) {
        const parser = new DOMParser();
        const document = parser.parseFromString(data, 'application/xml');
        const json = document.getElementsByTagName('return')[0].childNodes[0].nodeValue;

        return JSON.parse(json);
    }

    function processError(error) {
        // ToDo: Implement error interceptor!
        displayErrorMessage('Something went wrong!');
    }
}

function displayErrorMessage(errorMessage) {
    const errorMessageElement = document.getElementById('error-message');

    errorMessageElement.classList.remove('d-none');
    errorMessageElement.textContent = `${errorMessage}!`;
}