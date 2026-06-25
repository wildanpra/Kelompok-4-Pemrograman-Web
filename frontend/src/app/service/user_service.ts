import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BaseService } from "./Service";
import { catchError, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, User } from "../models/User";

@Injectable({providedIn: 'root'})
export class UserService extends BaseService{
    constructor(
        http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId)
    }
    //read semua data
    getAll(): Observable<ApiResponse<User[]>>{
        return this.http.get<ApiResponse<User[]>>(
            `${this.apiUrl}/users`,
            {headers: this.getHeaders()}
        ).pipe(
            catchError(this.handleError)
        )
    }
} 