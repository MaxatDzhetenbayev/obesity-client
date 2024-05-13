import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useState } from 'react'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../../firebaseConfig';
import { v4 as uuid } from "uuid";
import {doc, setDoc, } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export const EditText = () => {

    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const [lang, setLang] = useState('')
    const {fact} = useParams()

    const handleSave = async () => {
        const docId = uuid();
        const factRef = doc(db, "facts", docId);
        await setDoc(factRef, { content: text, title, lang, tag: fact });
    };


    return (
        <Box>
            <FormControl>
                <FormLabel >Выбор языка</FormLabel>
                <RadioGroup
                    value={lang}
                    onChange={(e) => {
                        setLang(e.target.value)
                    }}
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="kz" control={<Radio />} label="kz" />
                    <FormControlLabel value="ru" control={<Radio />} label="ru" />
                </RadioGroup>
            </FormControl>

            <TextField variant='standard' helperText="Заголовок" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <ReactQuill value={text} onChange={setText} />
            <button onClick={handleSave}>Сохранить</button>
        </Box>
    )
}
