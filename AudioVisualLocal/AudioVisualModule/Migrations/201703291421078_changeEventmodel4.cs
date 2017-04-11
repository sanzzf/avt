namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "Email", c => c.String());
            DropColumn("dbo.Events", "UserEmail");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "UserEmail", c => c.String());
            DropColumn("dbo.Events", "Email");
        }
    }
}
