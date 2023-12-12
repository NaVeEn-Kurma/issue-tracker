'use client'

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import { useForm,Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

type IssueForm=z.infer<typeof createIssueSchema>;

const CreateIssuePage = () => {
    //register is used to get the value of input fieds
    //formState is used to display validation Errors
    const {register,control,handleSubmit,formState:{errors}}=useForm<IssueForm>({resolver:zodResolver(createIssueSchema)});
    const [error,setError]=useState('');
    const [isSubmitting,setIsSubmitting]=useState(false);
    const router=useRouter();

    const onSubmit=handleSubmit(async(data)=>{
        try {
            setIsSubmitting(true);
            await axios.post('/api/issues',data);
            router.push('/issues')
        } catch (error) {
            setIsSubmitting(false);
            setError('An unExpected Error Occured')
        }  
    })

  return (
    <div className="max-w-xl ">
        {error && 
        <Callout.Root color="red" className="mb-3">
            <Callout.Text>
                {error}
            </Callout.Text>
        </Callout.Root>
        }
        <form className='space-y-3' onSubmit={onSubmit}>
            <TextField.Root>
                <TextField.Input placeholder='Title' {...register("title")}/>
            </TextField.Root>
            <ErrorMessage>
                {errors.title?.message}
            </ErrorMessage>
            <Controller
             name="description"
             control={control}
             render={({field})=><SimpleMDE placeholder='Description' {...field}/>}
            />
            <ErrorMessage>
                {errors.description?.message}
            </ErrorMessage>
            <Button disabled={isSubmitting}>Create New Issue {isSubmitting && <Spinner/>}</Button>
        </form>
    </div>
  )
}

export default CreateIssuePage;