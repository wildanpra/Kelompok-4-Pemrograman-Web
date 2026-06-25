import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BaseService } from "./Service";
import { ApiResponse, Customer } from "../models/Customer";
import { catchError, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CustomerService extends BaseService{
    constructor(
        http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId)
    }
    //read semua data
    getAll(): Observable<ApiResponse<Customer[]>>{
        return this.http.get<ApiResponse<Customer[]>>(
            `${this.apiUrl}/customers`,
            {headers: this.getHeaders()}
        ).pipe(
            catchError(this.handleError)
        )
    }
} 