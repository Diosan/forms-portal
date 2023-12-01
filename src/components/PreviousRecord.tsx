import React, {useEffect, useState} from "react"
import { API_URL} from "../config/api"
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