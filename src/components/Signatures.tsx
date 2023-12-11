import {useEffect, useState} from "react"
import { API_URL} from "../config/api"
import axios from "axios"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'
import '../assets/Submission.css'
import '../assets/Signature.css'

type SignaturesProps = {
    submission_id: number,
    complainant_email: string,
    complainant_name: string,
    already_signed: boolean,
    already_verified: boolean
}

const log = (type: any) => console.log.bind(console, type)


export const Signatures = ({
        submission_id, 
        complainant_email, 
        complainant_name, 
        already_signed, 
        already_verified
    }:SignaturesProps) => {

    const navigate = useNavigate()

    return (<><h5>Signatures</h5></>)

}