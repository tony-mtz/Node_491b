
use gameserver;
	
create table if not exists `users` (		
    `userName` varchar(70) not null,
    `userPass` varchar(255) not null,
    primary key (`userName`)
    ) engine = InnoDB default charset=utf8;
    
insert into `users` (`userName`, `userPass`) values ('tony', 'tony');
insert into `users` (`userName`, `userPass`) values ('jess', 'jess');

create table if not exists scores(
	



) engine = InnoDB default charset=utf8;

select * from users;
