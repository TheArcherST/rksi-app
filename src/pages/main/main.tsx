import React, { useRef } from "react";
import {FormikValues, useFormik} from 'formik';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import {InputText} from "primereact/inputtext";

import 'primeflex/primeflex.css';

import './main.css';
import APIAdapter, {InvalidUsernameOrPassword} from "../../adapters/api";
import {redirect, useNavigate,} from "react-router-dom";


export function LoginForm() {
    const toast = useRef<any>(null);
    const navigate = useNavigate();
    const showIncorrect = () => {
        toast.current.show({ severity: 'error', summary: 'Ошибка входа', detail: 'Неверный логин или пароль' });
    };

    const formik = useFormik<FormikValues>({
        initialValues: {
            value: '',
            password: '',
        },
        validate: (data: FormikValues) => {
            let errors: {username?: string, password?: string} = {};

            if (!data.username) {
                errors.username = 'Логин обязателен.';
            }
            if (!data.password) {
                errors.password = 'Пароль обязателен.';
            }

            return errors;
        },
        onSubmit: (data: FormikValues) => {
            const gateway = new APIAdapter();
            gateway.token({
                username: data.username,
                password: data.password,
            }).then(data => {
                formik.resetForm();
                navigate('/schedule');
            }).catch(err => {
                if (err instanceof InvalidUsernameOrPassword) {
                    showIncorrect();
                }
            })
        }
    });

    const isFormFieldInvalid = (name: string) => {
        return !!(formik.touched[name] && formik.errors[name]);
    };

    const getFormErrorMessage = (name: string) => {
        return isFormFieldInvalid(name)
            ? <small className="p-error">{String(formik.errors[name])}</small>
            : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className="card flex justify-content-center">
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                <label htmlFor="username">Логин</label>
                <Toast
                    ref={toast}
                    style={{marginTop: '5em'}}
                />
                <InputText
                    id="username"
                    name="username"
                    className={classNames({ 'p-invalid': isFormFieldInvalid('username') })}
                    value={formik.values.username || ''}
                    onChange={(e) => {
                        formik.setFieldValue('username', e.target.value);
                    }}
                />
                {getFormErrorMessage('username')}
                <label htmlFor="password">Пароль</label>
                <Password
                    inputId="password"
                    name="password"
                    className={classNames({ 'p-invalid': isFormFieldInvalid('password') })}
                    value={formik.values.password || ''}
                    feedback={false}
                    onChange={(e) => {
                        formik.setFieldValue('password', e.target.value);
                    }}
                />
                {getFormErrorMessage('password')}
                <Button
                    label="Войти"
                    type="submit"
                    style={{marginTop: '1em'}}
                />
            </form>
        </div>
    )
}


export default function Main() {
    return (
        <main className={"login-main"}>
            <h1>Вход в аккаунт</h1>
            <LoginForm />
        </main>
    )
}
