import { useField } from 'formik';
import React from 'react';
import { FormField, Label, Select } from 'semantic-ui-react';

interface Props{
    placeholder:string;
    name: string;
    options: any;
    label?: string;
}

export default function MySelectInput(props: Props){
    const [field, meta, helpers] = useField(props.name);
    return (
        <FormField error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select
                clearable
                options = {props.options}
                placeholder = {props.placeholder}
                value={field.value || null}
                onChange={(e,d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </FormField>
    )
}