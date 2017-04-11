namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class firstmigrartion : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Events", "user_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Events", new[] { "user_Id" });
            AddColumn("dbo.Events", "UserId", c => c.Int());
            DropColumn("dbo.Events", "user_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "user_Id", c => c.String(maxLength: 128));
            DropColumn("dbo.Events", "UserId");
            CreateIndex("dbo.Events", "user_Id");
            AddForeignKey("dbo.Events", "user_Id", "dbo.AspNetUsers", "Id");
        }
    }
}
