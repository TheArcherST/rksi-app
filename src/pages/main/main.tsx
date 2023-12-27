import React, { useRef } from "react";
import {FormikValues, useFormik} from 'formik';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import {InputText} from "primereact/inputtext";

import 'primeflex/primeflex.css';

import './main.css';
import APIAdapter, {APIError, InvalidUsernameOrPassword} from "../../adapters/api";
import {redirect, useNavigate, useSearchParams,} from "react-router-dom";



export function RegistrationForm() {
    const toast = useRef<any>(null);
    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const showIncorrect = () => {
        toast.current.show({ severity: 'error', summary: 'Ошибка регистрации', detail: 'Проверьте правильность введённых данных' });
    };

    const formik = useFormik<FormikValues>({
        initialValues: {
            value: '',
            password: '',
            first_name: '',
            second_name: '',
            patronymic: '',
            email: '',
        },
        validate: (data: FormikValues) => {
            let errors: {
                email?: string,
                password?: string,
                first_name?: string,
                second_name?: string,
                patronymic?: string,
            } = {};

            if (!data.email) {
                errors.email = 'Электронная почта обязательна.';
            }
            if (!data.password) {
                errors.password = 'Пароль обязателен.';
            }
            if (!data.first_name) {
                errors.first_name = 'Имя обязательно.';
            }
            if (!data.second_name) {
                errors.second_name = 'Фамилия обязательна.';
            }
            if (!data.patronymic) {
                errors.patronymic = 'Отчество обязательно.';
            }

            return errors;
        },
        onSubmit: (data: FormikValues) => {
            const gateway = new APIAdapter();
            gateway.register({
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                second_name: data.second_name,
                patronymic: data.patronymic,
            }).then(data => {
                formik.resetForm();
                navigate({
                    pathname: '/login',
                    search: searchParams.toString(),
                });
            }).catch(err => {
                if (err instanceof APIError) {
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
        <>
            <h1>Регистрация</h1>
            <div className="card flex justify-content-center">
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    <label htmlFor="second_name">Фиамилия</label>
                    <Toast
                        ref={toast}
                        style={{marginTop: '5em'}}
                    />
                    <InputText
                        id="second_name"
                        name="second_name"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('second_name') })}
                        value={formik.values.second_name || ''}
                        onChange={(e) => {
                            formik.setFieldValue('second_name', e.target.value);
                        }}
                    />
                    {getFormErrorMessage('second_name')}
                    <label htmlFor="username">Имя</label>
                    <InputText
                        id="first_name"
                        name="first_name"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('first_name') })}
                        value={formik.values.first_name || ''}
                        onChange={(e) => {
                            formik.setFieldValue('first_name', e.target.value);
                        }}
                    />
                    {getFormErrorMessage('first_name')}
                    <label htmlFor="patronymic">Отчество</label>
                    <InputText
                        id="patronymic"
                        name="patronymic"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('patronymic') })}
                        value={formik.values.patronymic || ''}
                        onChange={(e) => {
                            formik.setFieldValue('patronymic', e.target.value);
                        }}
                    />
                    {getFormErrorMessage('patronymic')}
                    <label htmlFor="email">Почта</label>
                    <InputText
                        id="email"
                        name="email"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
                        value={formik.values.email || ''}
                        onChange={(e) => {
                            formik.setFieldValue('email', e.target.value);
                        }}
                    />
                    {getFormErrorMessage('email')}
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
                        label="Подтвердить"
                        type="submit"
                        style={{marginTop: '1em'}}
                    />
                </form>
            </div>
        </>
    )
}


interface LoginFormProps {
    isTelegramRedirect: boolean;
}


export function LoginForm({isTelegramRedirect}: LoginFormProps) {
    const toast = useRef<any>(null);
    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();

    const showIncorrect = () => {
        toast.current.show({ severity: 'error', summary: 'Ошибка входа', detail: 'Неверный логин или пароль' });
    };

    const nextPage = function (access_token: string) {
        navigate(`/schedule-editor?origin=${isTelegramRedirect ? 'telegram' : 'plain'}`);
    }

    const formik = useFormik<FormikValues>({
        initialValues: {
            value: '',
            password: '',
        },
        validate: (data: FormikValues) => {
            let errors: {username?: string, password?: string} = {};

            if (!data.username) {
                errors.username = 'Почта обязателена.';
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
                if (!isTelegramRedirect) {
                    nextPage(data.access_token);
                } else {
                    let utm = searchParams.get('utm')
                    if (utm === null) {
                        return;
                    }
                    gateway.writeUTM(
                        {
                            utm_id: utm,
                            value: data.access_token,
                        }
                    ).then(data => {
                        document.location = `https://t.me/rksi_app_bot`
                    })
                }
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
        <>
            <h1>Вход в аккаунт</h1>
            <div className="card flex justify-content-center">
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    <label htmlFor="username">Почта</label>
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
                        label="Подтвердить"
                        type="submit"
                        style={{marginTop: '1em'}}
                    />
                </form>
            </div>
        </>
    )
}


export enum MainPageDestiny {
    LOGIN, REGISTER,
}


export interface MainProps {
    destiny: MainPageDestiny;
    isTelegramRedirect: boolean;
}


export default function Main(props: MainProps) {
    let className;

    switch (props.destiny) {
        case MainPageDestiny.LOGIN:
            className = "login-main";
            break;
        case MainPageDestiny.REGISTER:
            className = 'register-main';
            break;
        default:
            throw Error("Unknown destiny");
    }

    return (
        <main className={className}>
            {(props.destiny === MainPageDestiny.LOGIN) && <LoginForm isTelegramRedirect={props.isTelegramRedirect}/>}
            {(props.destiny === MainPageDestiny.REGISTER) && <RegistrationForm />}
        </main>
    )
}
