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
				return pool.query('SELECT NOW()')
				// TODO, close the pool when finished or something like that
			}, [pool]
		)
	)
	return <Text>{JSON.stringify(promiseResult)}</Text>
}
