import { Component, OnInit } from '@angular/core';
import {Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';

class User {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

class Comment {
  charId: number;
  quote: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  users: User[];
  show_user_data: boolean;
  current_user: User;
  max_id: number;
  roles: string[];
  comments: Comment[];
  user_info: {};
  private api_url = "https://batapi-177503.appspot.com";
  
  constructor(private http: Http) { }

  ngOnInit() {
    this.show_user_data = false;
    this.current_user = null;
    this.max_id = -1;
    this.users = [];
    this.roles = ["hero", "citizen", "villain"];
    this.user_info = {};
    this.getUsers();
    this.getComments();
  }

  getData(operation) {
    return this.http.get(this.api_url+'/'+operation).map((res: Response) => res.json());
  }

  getUsers() {
    this.getData('characters').subscribe(data => {
      data.forEach(element => {
        if(element.id > this.max_id) {
          this.max_id = element.id;
        }
        this.users.push(element);
      });
    });
  }

  getComments() {
    this.getData('quotes').subscribe(data => {
      this.comments = data;
    })
  }

  currentUserQuotes() {
    var result = [];
    this.comments.forEach(element => {
      if(element.charId == this.current_user.id) {
        result.push(element.quote)
      }
    });
    return result;
  }

  displayUserInfo(id) {
    if(this.current_user == null || this.current_user.id != id) {
      if(!(id in this.user_info)) {
        this.getData('characters/'+id).subscribe(data => {
          data.avatar = "https://batapi-177503.appspot.com/"+data.avatar;
          this.user_info[id] = data;
          this.current_user = this.user_info[id];
          this.show_user_data = true;      
        });  
      } else {
        this.current_user = this.user_info[id];
        this.show_user_data = true;
      }
    } else {
      this.show_user_data = false;
      this.current_user = null;
    }
  }

  differentRoles(role) {
    var result = [];
    this.roles.forEach(
     element => {
       if(element !== this.current_user.role) {
         result.push(element);
       }
     } 
    );
    return result;
  }

  saveChanges(name, role) {
    this.users.forEach(user => {
      if(user.id === this.current_user.id) {
        user.name = name;
        this.user_info[this.current_user.id].name = name;
        this.user_info[this.current_user.id].role = role;
        this.current_user = this.user_info[this.current_user.id];
      }
    })
    console.log(this.user_info);
  }
}
