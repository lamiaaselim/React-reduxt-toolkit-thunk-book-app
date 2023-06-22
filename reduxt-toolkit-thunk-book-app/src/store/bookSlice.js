import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import {logInsert } from "./reportSlice"

export const getBooks = createAsyncThunk (
    'book/getBooks', 
    async(_, thunkApI) => {
        const {rejectWithValue} = thunkApI
    try{
        const res = await fetch('http://localhost:3005/books');
        const data = await res.json();
        return data;
    }catch (error){
        return rejectWithValue(error.message);
    }
})
export const insertBooks = createAsyncThunk (
    'book/insertBooks', 
    async (bookData, thunkApI) => {
        const {rejectWithValue, getState , dispatch} = thunkApI
        try{
            bookData.userName = getState().auth.name;
            // dispatch(deleteBook({id:1}))
            const res = await fetch('http://localhost:3005/books',{
            method: 'POST',
            body: JSON.stringify(bookData),
            headers:{
                'Content-Type': 'application/json; charset = UTF-8',
            },
        });
        //Reporting 
        const data = await res.json();
        dispatch(logInsert({name: 'insertBooks', status: 'success'}));
        return data;
        } catch (error) {
            dispatch(logInsert({name: 'insertBooks', status: 'failed'}));
            return rejectWithValue(error.message);}
    });

export const deleteBook = createAsyncThunk('book/deleteBook', 
async(item, thunkApI) => {
    const {rejectWithValue} = thunkApI;
        try{
            await fetch(`http://localhost:3005/books/${item.id}`,{
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json; charset = UTF-8',
            },
        });
        return item;
        } catch (error) {return rejectWithValue(error.message);}

})

export const getBook = createAsyncThunk('book/getBook', 
async(item, thunkApI) => {
    const {rejectWithValue} = thunkApI;
        try{
            await fetch(`http://localhost:3005/books/${item.id}`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json; charset = UTF-8',
            },
        });
        return item;
        } catch (error) {return rejectWithValue(error.message);}

})


const bookSlice = createSlice({
    name: "book",
    initialState: {books: [], isLoading: false, error: null, bookInfo: null},
    extraReducers:{
        // getBooks
        [getBooks.pending]: (state, action) => {
            state.isLoading= true;
            state.error = null;
        },
        [getBooks.fulfilled]: (state, action) => {
            state.isLoading= false;
            state.books = action.payload;
        },
        [getBooks.rejected]: (state, action) => { 
            state.isLoading= false;
            state.error = action.payload;
        },
    // InsertBooks
        [insertBooks.pending]: (state, action)=>{
            state.isLoading= true;
            state.error = null;
        },
        [insertBooks.fulfilled]: (state, action)=>{
            state.isLoading= false;
            state.books.push(action.payload);
        },
        [insertBooks.rejected]: (state, action)=>{
            state.isLoading= false;
            state.error = action.payload;
        },
        // deleteBooks
        [deleteBook.pending]: (state, action)=>{
            state.isLoading= true;
            state.error = null;
        },
        [deleteBook.fulfilled]: (state, action)=>{
            state.isLoading= false;
            state.books = state.books.filter((el) => el.id !== action.payload.id)
        },
        [deleteBook.rejected]: (state, action)=>{
            state.isLoading= false;
            state.error = action.payload;
        },
        
    // read bookInfo
    [getBook.fulfilled]: (state, action)=>{
        state.isLoading= false;
        state.bookInfo = action.payload
    },
    },
});

export default bookSlice.reducer;