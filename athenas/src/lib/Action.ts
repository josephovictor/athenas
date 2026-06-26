"use server"

import { supabase } from "./supabase"

export const getCoordinator = async () => {
    const { data, error } = await supabase
    .from('Coordinator')
    .select('*')

    if (error) {
        throw new Error(`Error fetching coordinator: ${error.message}`);
    }
    return data;
}