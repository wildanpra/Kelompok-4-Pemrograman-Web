import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BaseService } from "./Service";
import { catchError, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, Contact } from "../models/Contact";

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService{
    constructor(
        http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId)
    }
    //read semua data
    getAll(): Observable<ApiResponse<Contact[]>>{
        return this.http.get<ApiResponse<Contact[]>>(
            `${this.apiUrl}/contacts`,
            {headers: this.getHeaders()}
        ).pipe(
            catchError(this.handleError)
        )
    }
} 