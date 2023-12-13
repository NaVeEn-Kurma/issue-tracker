'use client'

import { Spinner } from '@/app/components'
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DeleteIssueButton = ({IssueId}:{IssueId:number}) => {
    const router=useRouter();
    const [error,setError]=useState(false);
    const [isDeleting,setIsdeleting]=useState(false);

    const deleteIssue=async()=>{
        try {
            setIsdeleting(true);
            await axios.delete(`/api/issues/${IssueId}`)
            router.push('/issues')
            router.refresh()
        } catch (error) {
            setIsdeleting(false);
            setError(true);
        }
    }

  return (
    <>
    <AlertDialog.Root>
        <AlertDialog.Trigger>
            <Button color='red' disabled={isDeleting}>
                Delete Issue
                {isDeleting && <Spinner/>}
            </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content >
            <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
            <AlertDialog.Description >
                Are you sure you want to delete this issue? This action cannot be undone.
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                        Cancel
                    </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <Button variant="solid" color="red" onClick={deleteIssue}>
                        Delete Issue
                    </Button>
                </AlertDialog.Action>
            </Flex>
        </AlertDialog.Content>
    </AlertDialog.Root>
    <AlertDialog.Root open={error}>
        <AlertDialog.Content>
            <AlertDialog.Title>
                Error
            </AlertDialog.Title>
            <AlertDialog.Description>
                This Issue could not be Deleted.
            </AlertDialog.Description>
            <Button color='gray' variant='soft' mt='2' onClick={()=>setError(false)}>OK</Button>
        </AlertDialog.Content>
    </AlertDialog.Root>
    </>
    
  )
}

export default DeleteIssueButton