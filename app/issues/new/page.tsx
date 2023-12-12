'use client'

import React from 'react'
import { Button, TextArea, TextField } from '@radix-ui/themes';


const CreateIssuePage = () => {
  return (
    <div className='max-w-xl space-y-3'>
        <TextField.Root>
            <TextField.Input placeholder='Title' />
        </TextField.Root>
        <TextArea placeholder='Description'/>
        <Button>Create New Issue</Button>
    </div>
  )
}

export default CreateIssuePage;