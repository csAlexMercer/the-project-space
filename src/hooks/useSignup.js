import { useEffect, useState } from "react"
import { projectAuth, projectStorage, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [ isCancelled, setIsCancelled ] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        try{
            const res = await projectAuth.createUserWithEmailAndPassword(email,password)
            console.log(res.user)
            
            if(!res){
                throw new Error("Could not create the user")
            }

            //thumbnail
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
            const img = await projectStorage.ref(uploadPath).put(thumbnail)
            const imgUrl = await img.ref.getDownloadURL()

            //adding displayName to the created user
            await res.user.updateProfile({displayName, photoURL: imgUrl})

            //creating additional doc
            await projectFirestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL: imgUrl
            })

            //dispatch login action
            dispatch({type: 'LOGIN', payload: res.user})
            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }

        }catch(err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }

        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {signup, isPending, error}

}