import React, {useEffect, useMemo, useState} from "react";
import {Pool} from 'pg';
import {Text} from "ink";

export function usePromise<T, ErrorType extends Error>(promise: Promise<T>): {
	isResolved: boolean;
	isRejected: boolean;
	result: T | ErrorType | undefined
} {
	const [result, setResult] = useState<T | undefined>(undefined);
	const [isResolved, setIsResolved] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	useEffect(() => {
		promise.then(r => {
			setResult(r)
			setIsResolved(true)
			setIsRejected(false)
		}).catch(e => {
			setResult(e)
			setIsResolved(false)
			setIsRejected(true)
		})
	}, [promise]);
	return {
		isResolved,
		isRejected,
		result
	}
}

export const PostgresConnection = (
	{
		user, host, database, password, port
	}: {
		user: string,
		host: string,
		database: string,
		password: string,
		port: number,
	}) => {
	const pool = useMemo(() => {
		return new Pool(
			{
				user,
				host,
				database,
				password,
				port
			}
		)
	}, [
		user,
		host,
		database,
		password,
		port
	]);
	const promiseResult = usePromise(
		useMemo(() => {
			return (async () => {
				try {
					return await pool.query('SELECT NOW()')
				} catch(e){
					console.error(e);
					throw e
				}
			})()
				// TODO, close the pool when finished or something like that
			}, [pool]
		)
	);
	const promiseResolved = promiseResult.isResolved;
	if (promiseResolved) {
		// @ts-ignore
		const querySuccessful = promiseResult?.result?.rowCount === 1;
		if (querySuccessful) {
			return <Text>Successfully queried {host} {database}</Text>
		} else {
			return <Text>Could not connect to {host} {database}</Text>
		}
	} else {
		return <Text>Querying {host} {database} ...</Text>
	}
}
