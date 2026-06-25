import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BaseService } from "./Service";
import { catchError, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, Activities } from "../models/Activities";

@Injectable({providedIn: 'root'})
export class ActivitiesService extends BaseService{
    constructor(
        http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId)
    }
    //read semua data
    getAll(): Observable<ApiResponse<Activities[]>>{
        return this.http.get<ApiResponse<Activities[]>>(
            `${this.apiUrl}/activities`,
            {headers: this.getHeaders()}
        ).pipe(
            catchError(this.handleError)
        )
    }
} 