import { ApiProperty } from "@nestjs/swagger";

export class FileResponse{

    constructor(url:string){
        this.url = url
    }
    
    @ApiProperty()
    url: string;
}