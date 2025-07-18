terraform {
  backend "s3" {
    bucket = "samuel-terraform-state-bucket-12345"  # Replace with your actual bucket name
    key    = "cloud-resume/terraform.tfstate"
    region = "us-east-1"
  }
}
