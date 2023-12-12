'use client'

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import { useForm,Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueSchema } from "@/app/validationSchemas";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { Issue } from "@prisma/client";

const SimpleMDE=dynamic(()=> import('react-simplemde-editor'),{ssr:false})

type IssueFormdata=z.infer<typeof IssueSchema>;

const IssueForm = ({issue}:{issue?:Issue}) => {
    //register is used to get the value of input fieds
    //formState is used to display validation Errors
    const {register,control,handleSubmit,formState:{errors}}=useForm<IssueFormdata>({resolver:zodResolver(IssueSchema)});
    const [error,setError]=useState('');
    const [isSubmitting,setIsSubmitting]=useState(false);
    const router=useRouter();

    const onSubmit=handleSubmit(async(data)=>{
        try {
            setIsSubmitting(true);
            if(issue)
                await axios.patch(`/api/issues/${issue.id}`,data);
            else
                await axios.post('/api/issues',data);
            router.push('/issues')
            router.refresh()
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
                <TextField.Input defaultValue={issue?.title} placeholder='Title' {...register("title")}/>
            </TextField.Root>
            <ErrorMessage>
                {errors.title?.message}
            </ErrorMessage>
            <Controller
             name="description"
             control={control}
             defaultValue={issue?.description}
             render={({field})=><SimpleMDE placeholder='Description' {...field}/>}
            />
            <ErrorMessage>
                {errors.description?.message}
            </ErrorMessage>
            <Button disabled={isSubmitting}>
                {issue?'Update Issue':'Submit New Issue'}{' '}
                {isSubmitting && 
            <Spinner/>}</Button>
        </form>
    </div>
  )
}

export default IssueForm;