import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'

type SignIndictmentProps = {
    submission_id: number,
    complainant_email: string
}

const log = (type: any) => console.log.bind(console, type)


export const SignIndictment = ({submission_id, complainant_email}:SignIndictmentProps) => {

    const navigate = useNavigate()

    return (<>
        <div className="d-grid gap-2">
            <button className="btn btn-dark" type="submit">Sign Indictment</button>
        </div>
    </>)

}