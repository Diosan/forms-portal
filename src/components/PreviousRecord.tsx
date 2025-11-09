import React, {useEffect, useState} from "react"
const API_URL = import.meta.env.VITE_API_URL
import axios from "axios"
import Form from 'react-jsonschema-form'
import validator from '@rjsf/validator-ajv8'

type PreviousRecordProps = {
    accused_id: number
}

const log = (type: any) => console.log.bind(console, type)

const PreviousRecord = ({accused_id}: PreviousRecordProps) => {


    const [accusedPendings, setAccusedPendings] = useState<{}[]>([])

    const [accusedConvictions, setAccusedConvictions] = useState<{}[]>([])


}