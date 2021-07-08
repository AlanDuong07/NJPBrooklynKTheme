import $ from 'jquery';
import nod from '../common/nod';
import forms from '../common/models/forms';
import { classifyForm, Validators } from '../common/form-utils';

export default function() {
    var login_count = 0;
    var getLocation = function(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };

    $(document).ready(function() {
        loaded();
    });

    function registerLoginValidation($loginForm) {
        const loginModel = forms;

        const loginValidator = nod({
            submit: '.login-popup input[type="submit"]',
        });

        loginValidator.add([{
            selector: '.login-popup input[name="login_email"]',
            validate: (cb, val) => {
                const result = loginModel.email(val);
                cb(result);
            },
            errorMessage: 'Please use a valid email address, such as user@example.com.',
        }, {
            selector: '.login-popup input[name="login_pass"]',
            validate: (cb, val) => {
                const result = loginModel.password(val);
                cb(result);
            },
            errorMessage: 'You must enter a password.',
        }, ]);

        $loginForm.submit((event) => {
            this.loginValidator.performCheck();

            if (this.loginValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }


    /**
     * Request is made in this function to the remote endpoint and pulls back the states for country.
     * @param next
     */
    function loaded() {

        const $loginForm = classifyForm('.login-popup');

        if ($loginForm.length) {
            registerLoginValidation($loginForm);
        }

    }

}
