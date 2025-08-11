package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EcommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceApplication.class, args);
		System.out.println("http://localhost:8080/index.html");
		System.out.println("http://localhost:8080/register.html");
		System.out.println("http://localhost:8080/login.html");
		System.out.println("http://localhost:8080/product.html");
	}

}
